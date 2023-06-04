import React /* , { useState, useEffect } */ from "react";
import "./App.css";

function App() {
  const connectDevice = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        optionalServices: ["battery_service", "device_information"],
        acceptAllDevices: true,
      });

      //connect to the GATT server
      let deviceName = device.gatt.device.name;
      const server = await device.gatt.connect();

      //get the services we need through GATT server
      const batteryService = await server.getPrimaryService("battery_service");
      const infoService = await server.getPrimaryService("device_information");

      //GET CHARACTERISTICS OF BLUETOOTH SERVICES
      //getting the current battery level
      const batteryLevelCharacteristic = await batteryService.getCharacteristic(
        "battery_level"
      );
      //convert received buffer to human-readable form
      const batteryLevel = await batteryLevelCharacteristic.readValue();
      const batteryPercent = await batteryLevel.getUint8(0);

      //GETTING DEVICE INFORMATION
      //we will get all characteristics from <device_information>
      const infoCharacteristics = await infoService.getCharacteristics()
      console.log(infoCharacteristics)
      let infoValues = [];
      const promise = new Promise((resolve, reject) => {
        infoCharacteristics.forEach(async (characteristic, index, array) => {
          //returns a buffer
          const value = await characteristic.readValue();
          console.log(new TextDecoder().decode(value));
          //convert the buffer to string
          infoValues.push(new TextDecoder().decode(value))
          if(index === array.length - 1) resolve()
        })
      })
      promise.then(() => {
        return (
          <div>
            <p>Device Name: {deviceName}</p>
            <p>Battery Level: {batteryPercent}</p>
            <p>Device Information: </p>
            <br></br>
            <ul>
              {infoValues.map((value) => `<li>${value}</li>`).join("")}
            </ul>
          </div>
        )
      })



    } catch (err) {
      console.log(err);
      alert("An error occured while fetching device details");
    }
  };

  return (
    <div>
      {promise.then()}
      <button onClick={connectDevice}>Connect</button>
      <button>Disconnect</button>
    </div>
  );
}

export default App;
