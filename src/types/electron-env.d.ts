declare namespace NodeJS {
  interface Process {
    electron_process: import("child_process").ChildProcess;
  }
}
