# Codex Backend Process Management

## Overview
This document outlines the process management strategy for the Codex backend to prevent hanging processes and ensure reliable server startup/shutdown.

## Process Monitor Script Usage

### Commands
```bash
# Start server with timeout control (60s)
./process-monitor.sh start

# Stop server and cleanup processes
./process-monitor.sh stop

# Restart server (stop + start)
./process-monitor.sh restart

# Check current status and health
./process-monitor.sh status
```

### Features
- **Timeout Control**: 60-second timeout for server startup
- **Process Cleanup**: Automatically kills hanging nodemon/node processes
- **Health Monitoring**: Tests both port availability and HTTP endpoints
- **Logging**: All operations logged to `logs/process-monitor.log`
- **PID Tracking**: Tracks server PID for proper process management

## Timeout Strategy

### Startup Timeout (60s)
- Server must start and respond to health checks within 60 seconds
- If timeout exceeded, process is killed and error logged
- Prevents hanging npm/nodemon processes

### Health Check Timeout (5s)
- HTTP requests timeout after 5 seconds
- Prevents hanging curl/API calls
- Quick failure detection

### Process Cleanup Timeout (2s)
- Graceful shutdown attempt for 2 seconds
- Force kill (-9) if processes don't respond
- Port force-cleanup using fuser if needed

## Process States

### Healthy State
```
✅ Server is listening on port 5000
✅ Health endpoint responding
✅ Database connected
```

### Problem States
```
❌ Server startup timeout after 60s
❌ Health endpoint not responding
❌ Server process died unexpectedly
❌ Port 5000 still occupied after cleanup
```

## Monitoring and Logs

### Log File Location
```
/home/andy/projects/codex/backend/logs/process-monitor.log
```

### PID File Location
```
/home/andy/projects/codex/backend/logs/server.pid
```

### Real-time Monitoring
```bash
# Watch logs in real-time
tail -f logs/process-monitor.log

# Check process status
ps aux | grep node | grep -v grep

# Check port usage
ss -tulpn | grep :5000
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Run: `./process-monitor.sh stop`
   - Force kill: `fuser -k 5000/tcp`

2. **Hanging Processes**
   - Check: `ps aux | grep nodemon`
   - Kill: `pkill -f nodemon`

3. **Database Connection Issues**
   - Check PostgreSQL service: `systemctl status postgresql`
   - Verify connection string in `.env`

4. **Startup Timeout**
   - Check database connectivity
   - Review error logs in `logs/process-monitor.log`
   - Increase timeout if needed (modify `TIMEOUT_SECONDS`)

### Emergency Cleanup
```bash
# Nuclear option - kill all Node.js processes
pkill -f node

# Force free port 5000
fuser -k 5000/tcp

# Clean restart
./process-monitor.sh restart
```

## Best Practices

### Development Workflow
1. Always use `./process-monitor.sh start` instead of direct `npm run dev`
2. Use `./process-monitor.sh status` to check server health
3. Use `./process-monitor.sh restart` when making changes
4. Monitor logs during development: `tail -f logs/process-monitor.log`

### Production Deployment
1. Use process manager (PM2, systemd) for production
2. Configure automatic restarts and monitoring
3. Set appropriate timeouts for production environment
4. Implement external health checks

### Testing Strategy
1. Test startup under various conditions
2. Verify timeout handling works correctly
3. Test graceful shutdown and cleanup
4. Validate health check endpoints

## Performance Metrics

### Typical Startup Times
- Database connection: ~1-3 seconds
- Server ready: ~3-5 seconds
- First health check: ~5-8 seconds

### Resource Usage
- Memory: ~80-120MB (typical)
- CPU: <5% idle, ~20-40% during startup
- Port: 5000 (configurable via PORT env var)

## Configuration

### Environment Variables
```bash
# Server configuration
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://...

# Monitoring
TIMEOUT_SECONDS=60  # Startup timeout
```

### Script Configuration
Edit `process-monitor.sh` to adjust:
- `TIMEOUT_SECONDS`: Server startup timeout
- `LOG_FILE`: Log file location
- `PID_FILE`: PID file location
- `max_attempts`: Health check retry count

## Integration with CI/CD

### Health Check Commands
```bash
# Quick health check (suitable for CI)
curl -f -s --connect-timeout 5 http://localhost:5000/health

# Full status check
./process-monitor.sh status

# Automated restart
./process-monitor.sh restart && sleep 10 && ./process-monitor.sh status
```

This process management strategy ensures reliable server operations and prevents the hanging issues previously encountered.