import cluster, { Worker } from "cluster";
import os from 'os';
const { setupPrimary } = require("@socket.io/cluster-adapter");

export default function master() {
  console.log(`Master ${process.pid} is running`);

  // Get the number of CPU cores
  // const numCPUs = 1;
  const numCPUs = os.cpus().length;

  // setup connections between the workers
  setupPrimary();

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker: Worker, code: number, signal: string) => {
    console.log(`Worker ${worker.process.pid} died`);
    // cluster.fork();
  });
}