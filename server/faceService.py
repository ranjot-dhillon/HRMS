from flask import Flask, request, jsonify
from deepface import DeepFace
import base64, os
from PIL import Image
import cv2
from pathlib import Path

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
EMPLOYEE_FACE_DB = os.path.join(BASE_DIR, "public", "uploads")

@app.route('/verify-face', methods=['POST'])
def verify_face():
    try:
        data = request.json
        employee_id = data["employeeId"]
        image_data = data["image"]
        reference_filename = data["referenceImage"]
        print(reference_filename)
        # Save base64 as temp JPG
        temp_img1 = f"temp_{employee_id}.jpg"
        with open(temp_img1, "wb") as f:
            f.write(base64.b64decode(image_data.split(",")[1]))

        # Locate reference image
        reference_image = os.path.join(EMPLOYEE_FACE_DB, reference_filename)
        if not os.path.exists(reference_image):
            return jsonify({"success": False, "error": "Reference image not found"}), 404

        # Convert PNG → JPG if needed
        if reference_image.lower().endswith(".png"):
            img = Image.open(reference_image).convert("RGB")
            jpg_path = Path(reference_image).with_suffix(".jpg")
            img.save(jpg_path, "JPEG")
            reference_image = str(jpg_path)

        # Check if both images are readable
        if cv2.imread(temp_img1) is None:
            return jsonify({"success": False, "error": "Invalid captured image"}), 400
        if cv2.imread(reference_image) is None:
            return jsonify({"success": False, "error": "Invalid reference image"}), 400

        # Run DeepFace verification
        print(temp_img1)
        print(reference_image)
        print(os.getcwd()) 

        # image_path = r"C:\Users\dhill\Desktop\HRMS\server\temp_687f07ed71a413769acc27f5.jpg"

# Load the image
        # image = cv2.imread(image_path)

# Check if image is loaded successfully
        # if image is None:
        #    print("❌ Could not load image. Check the file path.")
        # else:
        #    print("✅ Image loaded successfully.")
        #    cv2.imshow("Test Image", image)
        #    cv2.waitKey(0)  # Wait until a key is pressed
        #    cv2.destroyAllWindows()

        result = DeepFace.verify(img1_path=temp_img1, img2_path=reference_image, model_name="Facenet")

        os.remove(temp_img1)

        return jsonify({
            "success": True,
            "verified": result["verified"],
            "distance": result["distance"],
            "confidence": round((1 - result["distance"]) * 100, 2)
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5001)
