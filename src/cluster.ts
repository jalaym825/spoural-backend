import cluster, { Worker } from "cluster";
import os from 'os';
import app from './app';
import { setupPrimary } from "@socket.io/cluster-adapter";

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);

  setupPrimary();

  const numCPUs = 1;
  // const numCPUs = os.cpus().length;

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  app();
}
