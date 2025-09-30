#!/bin/bash

# Comprehensive Startup Debug Script
# Logs everything and detects hanging processes

PROJECT_DIR="/home/andy/projects/codex"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"
LOG_DIR="$PROJECT_DIR/startup-logs"
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')

# Create log directory
mkdir -p "$LOG_DIR"

# Log files
MAIN_LOG="$LOG_DIR/startup_${TIMESTAMP}.log"
BACKEND_LOG="$LOG_DIR/backend_${TIMESTAMP}.log"
FRONTEND_LOG="$LOG_DIR/frontend_${TIMESTAMP}.log"
ERROR_LOG="$LOG_DIR/errors_${TIMESTAMP}.log"

# Timeout settings
STARTUP_TIMEOUT=90
HEALTH_CHECK_TIMEOUT=10
MAX_HANG_TIME=30

log() {
    local message="[$(date '+%Y-%m-%d %H:%M:%S')] $1"
    echo "$message" | tee -a "$MAIN_LOG"
}

error_log() {
    local message="[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1"
    echo "$message" | tee -a "$MAIN_LOG" | tee -a "$ERROR_LOG"
}

cleanup() {
    log "🧹 Cleaning up processes..."
    
    # Kill all node processes related to our project
    pkill -f "npm run dev" 2>/dev/null
    pkill -f "nodemon" 2>/dev/null
    pkill -f "react-scripts" 2>/dev/null
    pkill -f "webpack" 2>/dev/null
    
    # Force kill if port 5000 is occupied
    fuser -k 5000/tcp 2>/dev/null || true
    # Force kill if port 3000 is occupied  
    fuser -k 3000/tcp 2>/dev/null || true
    
    sleep 2
    log "✅ Cleanup completed"
}

check_dependencies() {
    log "📋 Checking dependencies..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        error_log "Node.js not found"
        return 1
    fi
    log "✅ Node.js: $(node --version)"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        error_log "npm not found"
        return 1
    fi
    log "✅ npm: $(npm --version)"
    
    # Check project directories
    if [ ! -d "$BACKEND_DIR" ]; then
        error_log "Backend directory not found: $BACKEND_DIR"
        return 1
    fi
    log "✅ Backend directory exists"
    
    if [ ! -d "$FRONTEND_DIR" ]; then
        error_log "Frontend directory not found: $FRONTEND_DIR"
        return 1
    fi
    log "✅ Frontend directory exists"
    
    # Check package.json files
    if [ ! -f "$BACKEND_DIR/package.json" ]; then
        error_log "Backend package.json not found"
        return 1
    fi
    
    if [ ! -f "$FRONTEND_DIR/package.json" ]; then
        error_log "Frontend package.json not found"
        return 1
    fi
    
    log "✅ All dependencies checked"
    return 0
}

install_dependencies() {
    log "📦 Installing dependencies..."
    
    # Backend dependencies
    log "Installing backend dependencies..."
    cd "$BACKEND_DIR" || exit 1
    
    if ! timeout 300 npm install >> "$BACKEND_LOG" 2>&1; then
        error_log "Backend npm install failed or timed out"
        return 1
    fi
    log "✅ Backend dependencies installed"
    
    # Frontend dependencies
    log "Installing frontend dependencies..."
    cd "$FRONTEND_DIR" || exit 1
    
    if ! timeout 300 npm install >> "$FRONTEND_LOG" 2>&1; then
        error_log "Frontend npm install failed or timed out"
        return 1
    fi
    log "✅ Frontend dependencies installed"
    
    return 0
}

start_backend() {
    log "🚀 Starting backend..."
    cd "$BACKEND_DIR" || exit 1
    
    # Start backend with timeout and logging
    timeout $STARTUP_TIMEOUT npm run dev > "$BACKEND_LOG" 2>&1 &
    local backend_pid=$!
    
    log "Backend started with PID: $backend_pid"
    echo $backend_pid > "$LOG_DIR/backend.pid"
    
    # Monitor backend startup
    local counter=0
    local max_attempts=30
    local hang_counter=0
    
    while [ $counter -lt $max_attempts ]; do
        # Check if process is still running
        if ! kill -0 $backend_pid 2>/dev/null; then
            error_log "Backend process died unexpectedly"
            log "Backend log tail:"
            tail -20 "$BACKEND_LOG" | tee -a "$MAIN_LOG"
            return 1
        fi
        
        # Check if port 5000 is listening
        if ss -tulpn | grep ":5000" > /dev/null 2>&1; then
            log "✅ Backend port 5000 is listening"
            
            # Test health endpoint
            if timeout $HEALTH_CHECK_TIMEOUT curl -s http://localhost:5000/health > /dev/null 2>&1; then
                log "✅ Backend health endpoint responding"
                return 0
            else
                log "⚠️ Backend port listening but health check failed"
            fi
        fi
        
        # Check for hanging (no new log entries)
        local current_log_size=$(wc -l < "$BACKEND_LOG" 2>/dev/null || echo 0)
        if [ "$current_log_size" = "$previous_log_size" ]; then
            hang_counter=$((hang_counter + 1))
            if [ $hang_counter -ge $MAX_HANG_TIME ]; then
                error_log "Backend appears to be hanging (no log activity for ${MAX_HANG_TIME}s)"
                log "Current backend log:"
                tail -50 "$BACKEND_LOG" | tee -a "$MAIN_LOG"
                kill -9 $backend_pid 2>/dev/null || true
                return 1
            fi
        else
            hang_counter=0
        fi
        previous_log_size=$current_log_size
        
        counter=$((counter + 1))
        sleep 3
        log "Backend startup attempt $counter/$max_attempts (hang counter: $hang_counter)"
    done
    
    error_log "Backend startup timeout after $((max_attempts * 3)) seconds"
    log "Final backend log:"
    tail -50 "$BACKEND_LOG" | tee -a "$MAIN_LOG"
    kill -9 $backend_pid 2>/dev/null || true
    return 1
}

start_frontend() {
    log "🎨 Starting frontend..."
    cd "$FRONTEND_DIR" || exit 1
    
    # Start frontend with timeout and logging
    timeout $STARTUP_TIMEOUT npm run dev > "$FRONTEND_LOG" 2>&1 &
    local frontend_pid=$!
    
    log "Frontend started with PID: $frontend_pid"
    echo $frontend_pid > "$LOG_DIR/frontend.pid"
    
    # Monitor frontend startup
    local counter=0
    local max_attempts=30
    local hang_counter=0
    
    while [ $counter -lt $max_attempts ]; do
        # Check if process is still running
        if ! kill -0 $frontend_pid 2>/dev/null; then
            error_log "Frontend process died unexpectedly"
            log "Frontend log tail:"
            tail -20 "$FRONTEND_LOG" | tee -a "$MAIN_LOG"
            return 1
        fi
        
        # Check if port 3000 is listening
        if ss -tulpn | grep ":3000" > /dev/null 2>&1; then
            log "✅ Frontend port 3000 is listening"
            
            # Test if frontend is responding
            if timeout $HEALTH_CHECK_TIMEOUT curl -s http://localhost:3000 > /dev/null 2>&1; then
                log "✅ Frontend is responding"
                return 0
            else
                log "⚠️ Frontend port listening but not responding to HTTP"
            fi
        fi
        
        # Check for hanging
        local current_log_size=$(wc -l < "$FRONTEND_LOG" 2>/dev/null || echo 0)
        if [ "$current_log_size" = "$previous_frontend_log_size" ]; then
            hang_counter=$((hang_counter + 1))
            if [ $hang_counter -ge $MAX_HANG_TIME ]; then
                error_log "Frontend appears to be hanging (no log activity for ${MAX_HANG_TIME}s)"
                log "Current frontend log:"
                tail -50 "$FRONTEND_LOG" | tee -a "$MAIN_LOG"
                kill -9 $frontend_pid 2>/dev/null || true
                return 1
            fi
        else
            hang_counter=0
        fi
        previous_frontend_log_size=$current_log_size
        
        counter=$((counter + 1))
        sleep 3
        log "Frontend startup attempt $counter/$max_attempts (hang counter: $hang_counter)"
    done
    
    error_log "Frontend startup timeout after $((max_attempts * 3)) seconds"
    log "Final frontend log:"
    tail -50 "$FRONTEND_LOG" | tee -a "$MAIN_LOG"
    kill -9 $frontend_pid 2>/dev/null || true
    return 1
}

show_status() {
    log "📊 Current system status:"
    
    echo "=== PROCESSES ===" | tee -a "$MAIN_LOG"
    ps aux | grep -E "(node|npm)" | grep -v grep | tee -a "$MAIN_LOG"
    
    echo "=== PORTS ===" | tee -a "$MAIN_LOG"
    ss -tulpn | grep -E ":(3000|5000)" | tee -a "$MAIN_LOG"
    
    echo "=== RECENT BACKEND LOG ===" | tee -a "$MAIN_LOG"
    if [ -f "$BACKEND_LOG" ]; then
        tail -10 "$BACKEND_LOG" | tee -a "$MAIN_LOG"
    else
        echo "No backend log found" | tee -a "$MAIN_LOG"
    fi
    
    echo "=== RECENT FRONTEND LOG ===" | tee -a "$MAIN_LOG"
    if [ -f "$FRONTEND_LOG" ]; then
        tail -10 "$FRONTEND_LOG" | tee -a "$MAIN_LOG"
    else
        echo "No frontend log found" | tee -a "$MAIN_LOG"
    fi
}

main() {
    log "🎯 Starting Codex Full Stack Application"
    log "📁 Project directory: $PROJECT_DIR"
    log "📝 Logs will be saved to: $LOG_DIR"
    
    # Trap to cleanup on exit
    trap cleanup EXIT INT TERM
    
    # Initial cleanup
    cleanup
    
    # Check dependencies
    if ! check_dependencies; then
        error_log "Dependency check failed"
        exit 1
    fi
    
    # Install dependencies if needed
    log "🤔 Checking if dependencies need installation..."
    if [ "$1" = "--install" ] || [ ! -d "$BACKEND_DIR/node_modules" ] || [ ! -d "$FRONTEND_DIR/node_modules" ]; then
        if ! install_dependencies; then
            error_log "Dependency installation failed"
            exit 1
        fi
    else
        log "✅ Skipping dependency installation (use --install to force)"
    fi
    
    # Start backend
    if ! start_backend; then
        error_log "Backend startup failed"
        show_status
        exit 1
    fi
    
    # Start frontend
    if ! start_frontend; then
        error_log "Frontend startup failed"  
        show_status
        exit 1
    fi
    
    log "🎉 Both backend and frontend started successfully!"
    log "🌐 Frontend: http://localhost:3000"
    log "🔧 Backend: http://localhost:5000"
    log "📊 Health check: http://localhost:5000/health"
    
    show_status
    
    log "✨ Startup complete! Press Ctrl+C to stop all services."
    log "📝 Logs available in: $LOG_DIR"
    
    # Keep script running and monitor for hangs
    while true; do
        sleep 30
        log "🔄 Health check..."
        
        # Quick health checks
        if ! timeout 5 curl -s http://localhost:5000/health > /dev/null 2>&1; then
            error_log "Backend health check failed"
            show_status
            break
        fi
        
        if ! timeout 5 curl -s http://localhost:3000 > /dev/null 2>&1; then
            error_log "Frontend health check failed"
            show_status
            break
        fi
        
        log "✅ Both services healthy"
    done
}

# Show usage
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "Usage: $0 [--install] [--help]"
    echo ""
    echo "Options:"
    echo "  --install    Force npm install for both backend and frontend"
    echo "  --help       Show this help message"
    echo ""
    echo "The script will:"
    echo "1. Clean up any existing processes"
    echo "2. Check dependencies"
    echo "3. Install npm packages if needed"
    echo "4. Start backend with hang detection"
    echo "5. Start frontend with hang detection"
    echo "6. Monitor both services"
    echo ""
    echo "All logs are saved to startup-logs/ directory"
    echo "Press Ctrl+C to stop all services"
    exit 0
fi

main "$@"