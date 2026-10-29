from ultralytics import YOLO
import cv2
import csv


def pixel_to_gps(x, y, frame_width, frame_height, metadata):
    lat = metadata["lat_max"] - (y / frame_height) * (metadata["lat_max"] - metadata["lat_min"])
    lon = metadata["lon_min"] + (x / frame_width) * (metadata["lon_max"] - metadata["lon_min"])
    return round(lat, 6), round(lon, 6)


def detect_video(video_path, model_path="best_v2.pt", save_output=True):

    model = YOLO(model_path)
    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        print("❌ Error: Cannot open video")
        return

    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = int(cap.get(cv2.CAP_PROP_FPS)) or 30

    print("FPS =", fps)
    print("Resolution =", width, "x", height)

    if save_output:
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter("output_detected.mp4", fourcc, fps, (width, height))

    # 📍 GPS bounds (replace with drone data)
    gps_metadata = {
        "lat_min": 18.5200,
        "lat_max": 18.5300,
        "lon_min": 73.8500,
        "lon_max": 73.8600
    }

    # 📄 CSV setup
    csv_file = open("detected_human_gps.csv", "w", newline="")
    csv_writer = csv.writer(csv_file)
    csv_writer.writerow(["Frame", "Time_sec", "Latitude", "Longitude", "Center_X", "Center_Y"])

    frame_count = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1
        current_time = round(frame_count / fps, 2)

        results = model.predict(frame, conf=0.5, verbose=False)

        human_found = False
        detected_center = None

        for r in results:
            im_bgr = r.plot()

            if r.boxes is None:
                continue

            for box, cls in zip(r.boxes.xyxy, r.boxes.cls):
                if int(cls) == 0:  # person
                    x1, y1, x2, y2 = map(int, box)
                    cx = (x1 + x2) // 2
                    cy = (y1 + y2) // 2

                    cv2.circle(im_bgr, (cx, cy), 5, (0, 0, 255), -1)

                    detected_center = (cx, cy)
                    human_found = True

        # ✅ STORE ONLY WHEN HUMAN DETECTED
        if human_found and detected_center:
            lat, lon = pixel_to_gps(
                detected_center[0],
                detected_center[1],
                width,
                height,
                gps_metadata
            )

            csv_writer.writerow([
                frame_count,
                current_time,
                lat,
                lon,
                detected_center[0],
                detected_center[1]
            ])

            # 🔴 Overlay
            cv2.putText(im_bgr, "Human Detected", (10, 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

            cv2.putText(im_bgr, f"Lat: {lat}", (10, 55),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2)

            cv2.putText(im_bgr, f"Lon: {lon}", (10, 80),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2)

        if save_output:
            out.write(im_bgr)

    cap.release()
    out.release()
    csv_file.close()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    detect_video("test.mp4")
