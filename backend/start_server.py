import os
import sys
import subprocess
import time
import signal
import psutil

def kill_process_on_port(port):
    """Kill any process using the specified port"""
    for proc in psutil.process_iter(['pid', 'name', 'connections']):
        try:
            for conn in proc.connections():
                if conn.laddr.port == port:
                    print(f"Process {proc.pid} ({proc.name()}) is using port {port}. Terminating...")
                    try:
                        proc.terminate()
                        proc.wait(timeout=3)
                        print(f"Process terminated successfully.")
                        return True
                    except Exception as e:
                        print(f"Error terminating process: {e}")
        except:
            pass
    return False

def start_server():
    """Start Django server with proper error handling"""
    # Set environment variable to show detailed errors
    os.environ["PYTHONUNBUFFERED"] = "1"
    
    # Kill any process using port 8000
    kill_process_on_port(8000)
    
    # Start the server
    try:
        print("Starting Django server...")
        
        # Use subprocess.Popen to start the server
        process = subprocess.Popen(
            [sys.executable, "manage.py", "runserver", "--nothreading"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=1
        )
        
        # Monitor the server for startup
        print("Waiting for server to start...")
        start_time = time.time()
        server_started = False
        
        while time.time() - start_time < 30:  # Wait up to 30 seconds
            # Read lines from stdout and stderr
            stdout_line = process.stdout.readline().strip() if process.stdout else ""
            stderr_line = process.stderr.readline().strip() if process.stderr else ""
            
            if stdout_line:
                print(f"Server: {stdout_line}")
                if "Starting development server at" in stdout_line:
                    server_started = True
                    break
            
            if stderr_line:
                print(f"Error: {stderr_line}")
                if "Error" in stderr_line or "Exception" in stderr_line:
                    print("Server startup failed due to errors.")
                    break
            
            if process.poll() is not None:
                print("Server process exited prematurely.")
                break
                
            time.sleep(0.1)
        
        if server_started:
            print("\nServer started successfully!")
            print("Press Ctrl+C to stop the server.")
            
            # Continue to output logs
            while True:
                stdout_line = process.stdout.readline().strip() if process.stdout else ""
                stderr_line = process.stderr.readline().strip() if process.stderr else ""
                
                if stdout_line:
                    print(f"Server: {stdout_line}")
                
                if stderr_line:
                    print(f"Error: {stderr_line}")
                
                if process.poll() is not None:
                    print("Server process exited.")
                    break
        else:
            print("Failed to start server within timeout period.")
            if process.poll() is None:
                process.terminate()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        if 'process' in locals() and process.poll() is None:
            process.terminate()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    start_server()
