#!/bin/bash

# Process Monitor Script for Codex Backend
# Handles server startup with timeout controls and process documentation

TIMEOUT_SECONDS=60
LOG_FILE="/home/andy/projects/codex/backend/logs/process-monitor.log"
PID_FILE="/home/andy/projects/codex/backend/logs/server.pid"

# Create logs directory if it doesn't exist
mkdir -p "$(dirname "$LOG_FILE")"

log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

check_port() {
    local port=$1
    ss -tulpn | grep ":$port " > /dev/null
    return $?
}

kill_existing_processes() {
    log_message "Checking for existing Node.js processes..."
    
    # Kill existing nodemon processes
    pkill -f nodemon 2>/dev/null && log_message "Killed existing nodemon processes"
    
    # Kill existing node server.js processes
    pkill -f "node server.js" 2>/dev/null && log_message "Killed existing node server.js processes"
    
    # Wait a moment for processes to die
    sleep 2
    
    # Force kill if port is still occupied
    if check_port 5000; then
        log_message "Port 5000 still occupied, force killing processes..."
        fuser -k 5000/tcp 2>/dev/null || true
        sleep 2
    fi
}

start_server() {
    log_message "Starting server with timeout control..."
    
    # Start server in background with timeout
    timeout $TIMEOUT_SECONDS npm run dev &
    local server_pid=$!
    echo $server_pid > "$PID_FILE"
    
    log_message "Server started with PID: $server_pid"
    
    # Monitor server startup
    local counter=0
    local max_attempts=20
    
    while [ $counter -lt $max_attempts ]; do
        if check_port 5000; then
            log_message "✅ Server is listening on port 5000"
            
            # Test health endpoint
            if curl -s --connect-timeout 5 http://localhost:5000/health > /dev/null 2>&1; then
                log_message "✅ Health endpoint responding"
                return 0
            else
                log_message "⚠️  Health endpoint not responding yet..."
            fi
        fi
        
        # Check if process is still running
        if ! kill -0 $server_pid 2>/dev/null; then
            log_message "❌ Server process died unexpectedly"
            return 1
        fi
        
        counter=$((counter + 1))
        sleep 3
    done
    
    log_message "❌ Server startup timeout after ${TIMEOUT_SECONDS}s"
    kill $server_pid 2>/dev/null || true
    return 1
}

stop_server() {
    if [ -f "$PID_FILE" ]; then
        local pid=$(cat "$PID_FILE")
        if kill -0 $pid 2>/dev/null; then
            log_message "Stopping server (PID: $pid)"
            kill $pid
            sleep 3
            
            # Force kill if still running
            if kill -0 $pid 2>/dev/null; then
                log_message "Force killing server"
                kill -9 $pid
            fi
        fi
        rm -f "$PID_FILE"
    fi
    
    kill_existing_processes
}

status_check() {
    log_message "=== PROCESS STATUS CHECK ==="
    
    echo "Node.js processes:"
    ps aux | grep node | grep -v grep || echo "No Node.js processes running"
    
    echo -e "\nPort 5000 status:"
    if check_port 5000; then
        ss -tulpn | grep ":5000"
        echo "✅ Port 5000 is in use"
    else
        echo "❌ Port 5000 is free"
    fi
    
    echo -e "\nHealth check:"
    if curl -s --connect-timeout 5 http://localhost:5000/health > /dev/null 2>&1; then
        echo "✅ Server responding"
        curl -s http://localhost:5000/health
    else
        echo "❌ Server not responding"
    fi
}

case "$1" in
    start)
        kill_existing_processes
        start_server
        ;;
    stop)
        stop_server
        ;;
    restart)
        stop_server
        sleep 2
        start_server
        ;;
    status)
        status_check
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status}"
        exit 1
        ;;
esac