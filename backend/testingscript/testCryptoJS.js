const mongoose = require("mongoose");
const { decryptData } = require("./utils/encryption");
const Beat = require("./models/Beat");
const mongoUri = "mongodb://127.0.0.1:27017/FieldExpo";

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(" MongoDB Connected");
    decryptAllBeats();
  })
  .catch((err) => {
    console.error(" MongoDB Connection Error:", err);
  });
async function decryptAllBeats() {
  try {
    const beats = await Beat.find();
    const decryptedBeats = beats.map((beat) => {
      const decryptedBeatName = decryptData(beat.beatName);
      if (!decryptedBeatName) {
        console.error("Decryption failed for beat:", beat._id);
        return {
          id: beat._id,
          beatName: "DECRYPTION_FAILED",
        };
      }

      return {
        id: beat._id,
        beatName: decryptedBeatName,
      };
    });

    console.log("Decrypted Beats:", decryptedBeats);
  } catch (err) {
    console.error("Error decrypting beats:", err);
  } finally {
    mongoose.connection.close();
  }
}
