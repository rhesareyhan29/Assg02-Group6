let mqttClient;
let running = true; // Simulate the state of the process

window.addEventListener("load", () => {
  const toggleBtn = document.getElementById("toggle");
  const statusInput = document.getElementById("status");

  // Connect to the MQTT broker
  connectToBroker();

  toggleBtn.addEventListener("click", () => {
    running = !running;
    toggleBtn.innerText = running ? "Stop Responding" : "Start Responding";
    statusInput.value = running ? "Running" : "Stopped";
  });

  mqttClient.on("message", (topic, message) => {
    if (running && topic === "ping" && message.toString() === "ping") {
      console.log("Received ping, sending pong...");
      mqttClient.publish("pong", "pong");
    }
  });
});

function connectToBroker() {
  const clientId = "crashable" + Math.random().toString(36).substring(7);
  const host = "ws://192.168.79.52:9001/mqtt"; // Update with your broker's address

  mqttClient = mqtt.connect(host, {
    clientId,
    keepalive: 60,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
  });

  mqttClient.on("connect", () => {
    console.log("Connected to broker");
    mqttClient.subscribe("ping", () => {
      console.log("Subscribed to ping topic");
    });
  });

  mqttClient.on("error", (err) => {
    console.error("Connection error: ", err);
  });
}
