import cluster from "cluster";
import master from "./master";  
import worker from "./worker";
if (cluster.isPrimary) {
  master();
}
else {
  worker();
}