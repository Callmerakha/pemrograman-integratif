import { loadPackageDefinition, credentials } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";

const packageDefinition = loadSync("./formpresensi.proto", {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const presensi = loadPackageDefinition(packageDefinition).presensi;

import { createInterface } from "readline";

const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
});


const dummyMhs = {
  id: "123",
  nama: "Dummy Mhs",
  nrp: "Dummy NRP",
};



const addMhs = () => {
  readline.question("Masukan Mhs ID: ", (id) => {
    readline.question("Masukan Nama: ", (nama) => {
      readline.question("Masukan NRP: ", (nrp) => {
        const mhs = {
          id: id,
          nama: nama,
          nrp: nrp,
        };
        client.AddMhs({ mhs: mhs }, (err, response) => {
          console.log("Mhs Sukses Ditambahkan: ", response);
          readline.close();
        });
      });
    });
  });
};

const getMhs = () => {
  readline.question("Masukkan ID Mhs: ", (id) => {
    client.getMhs({ id: id }, (err, response) => {
      console.log("Mhs Berhasil: ", response);
      readline.close();
    });
  });
};

const updateMhs = () => {
  readline.question("Masukkan ID Mhs ", (id) => {
    readline.question("Masukkan nama baru: ", (nama) => {
      readline.question("Masukkan nrp baru: ", (nrp) => {
        const mhs= {
          id: id,
          nama: nama,
          nrp: nrp,
        };
        client.UpdateMhs({ mhs: mhs }, (err, response) => {
          console.log("Mhs Berhasil Diupdate: ", response);
          readline.close();
        });
      });
    });
  });
};

const deleteMhs = () => {
  readline.question("Masukkan Mhs ID: ", (id) => {
    client.DeleteMhs({ id: id }, (err, response) => {
      console.log("Mhs Berhasil di delete: ", response);
      readline.close();
    });
  });
};
const getAllMhss = () => {
  client.getAllMhss({}, (err, response) => {
    if (err) {
      console.error("Error mendapat Mhs: ", err);
      return;
    }
    console.log("Semua mhs sukses: ", response.mhss);
    readline.close();
  });
};

const main = () => {
  readline.question(
    "halooo, yuk presensi dulu. beri command: add, get, update, delete, getAll: ",
    (operation) => {
      switch (operation) {
        case "add":
          addMhs();
          break;
        case "get":
          getMhs();
          break;
        case "update":
          updateMhs();
          break;
        case "delete":
          deleteMhs();
          break;
        case "getAll":
          getAllMhss();
          break;
        default:
          console.log("Invalid operation");
          readline.close();
          break;
      }
    }
  );
};

const client = new presensi.PresensiService(
  "localhost:50051",
  credentials.createInsecure()
);

main();
