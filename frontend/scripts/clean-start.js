import { exec } from 'child_process';
import os from 'os';

// Command to check ports based on operating system
const checkPortCmd = os.platform() === 'win32'
  ? `netstat -ano | findstr :3000`
  : `lsof -i :3000`;

// Command to kill process based on operating system
const getKillCmd = (pid) => os.platform() === 'win32'
  ? `taskkill /F /PID ${pid}`
  : `kill -9 ${pid}`;

console.log('Checking for processes on port 3000...');

exec(checkPortCmd, (error, stdout) => {
  if (stdout) {
    console.log('Found active process on port 3000');
    
    // Extract PID from output
    let pid;
    if (os.platform() === 'win32') {
      // Windows: Extract the last column as PID
      const match = stdout.match(/LISTENING\s+(\d+)/);
      if (match) pid = match[1];
    } else {
      // Unix/Mac: Extract PID from lsof output
      const match = stdout.match(/\w+\s+(\d+)/);
      if (match) pid = match[1];
    }
    
    if (pid) {
      console.log(`Stopping process ${pid} using port 3000...`);
      // Kill the process
      exec(getKillCmd(pid), (error) => {
        if (error) {
          console.error(`Failed to kill process: ${error.message}`);
          process.exit(1);
        } else {
          console.log('Successfully freed port 3000');
          startDev();
        }
      });
    } else {
      console.error('Could not determine process ID');
      process.exit(1);
    }
  } else {
    console.log('No process found on port 3000');
    startDev();
  }
});

function startDev() {
  console.log('Starting Next.js dev server on port 3000...');
  const childProcess = exec('next dev -p 3000');
  
  childProcess.stdout.pipe(process.stdout);
  childProcess.stderr.pipe(process.stderr);
  
  process.on('SIGINT', () => {
    console.log('Gracefully shutting down dev server...');
    childProcess.kill();
    process.exit(0);
  });
}
