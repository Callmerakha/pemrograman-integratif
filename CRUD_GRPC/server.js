import {
  Server,
  loadPackageDefinition,
  ServerCredentials,
} from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";

// Import Firebase Admin libraries
import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

// Initialize Firebase app with service account config
const firebaseConfig = {
  credential: admin.credential.cert(serviceAccount),
};
admin.initializeApp(firebaseConfig);

// Initialize Firestore
const db = admin.firestore();

const server = new Server();

const packageDefinition = loadSync("./formpresensi.proto", {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const presensi = loadPackageDefinition(packageDefinition).presensi;

const addMhs = async (call, callback) => {
  const mhs = call.request.mhs;
  const mhsRef = db.collection("mhss").doc(mhs.id);
  try {
    await mhsRef.set(mhs);
    const docSnapshot = await mhsRef.get();
    const data = docSnapshot.data();
    const response = {
      id: data.id,
      nama: data.nama,
      nrp: data.nrp,
    };
    callback(null, response);
  } catch (error) {
    console.log("Error menambah Mhs: ", error);
    callback(error);
  }
};

const getMhs = async (call, callback) => {
  const id = call.request.id;
  const mhsRef = db.collection("mhss").doc(id);
  try {
    const docSnapshot = await mhsRef.get();
    if (docSnapshot.exists) {
      const data = docSnapshot.data();
      const response = {
        id: data.id,
        nama: data.nama,
        nrp: data.nrp,
      };
      callback(null, response);
    } else {
      const error = new Error(`Mhs dengan id ${id} tidak ditemukan`);
      callback(error);
    }
  } catch (error) {
    console.log("Error mendapat Mhs: ", error);
    callback(error);
  }
};

const getAllMhss = async (call, callback) => {
  const mhssRef = db.collection("mhss");
  try {
    const querySnapshot = await mhssRef.get();
    const mhss = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const mhs = {
        id: doc.id, 
        nama: data.nama,
        nrp: data.nrp,
      };
      mhss.push(mhs);
    });
    callback(null, { mhss: mhss });
  } catch (error) {
    console.log("Error mendapatkan Mhss: ", error);
    callback(error);
  }
};

const updateMhs = async (call, callback) => {
  const mhs = call.request.mhs;
  const mhsRef = db.collection("mhss").doc(mhs.id);
  try {
    await mhsRef.update(mhs);
    const response = {
      id: mhs.id,
      nama: mhs.nama,
      nrp: mhs.nrp,
    };
    callback(null, response);
  } catch (error) {
    console.log("Error update mhs: ", error);
    callback(error);
  }
};

const deleteMhs = async (call, callback) => {
  const id = call.request.id;
  const mhsRef = db.collection("mhss").doc(id);
  try {
    const docSnapshot = await mhsRef.get();
    if (docSnapshot.exists) {
      const data = docSnapshot.data();
      await mhsRef.delete();
      const response = {
        id: data.id,
        nama: data.nama,
        nrp: data.nrp,
      };
      callback(null, response);
    }
  } catch (error) {
    console.log("Error delete Mhs: ", error);
    callback(error);
  }
};

server.addService(presensi.PresensiService.service, {
  addMhs: addMhs,
  getMhs: getMhs,
  updateMhs: updateMhs,
  deleteMhs: deleteMhs,
  GetAllMhss: getAllMhss,
});

server.bindAsync("localhost:50051", ServerCredentials.createInsecure(), () => {
  console.log("Server running at http://localhost:50051");
  server.start();
});
