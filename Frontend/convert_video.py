import cv2
import sys

def convert():
    print("Starting conversion...")
    cap = cv2.VideoCapture('c:/Users/Admin/Documents/Personal/Final/Frontend/public/output_detected.mp4')
    if not cap.isOpened():
        print("Error opening input video.")
        sys.exit(1)
        
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)

    fourcc = cv2.VideoWriter_fourcc(*'VP80')
    out = cv2.VideoWriter('c:/Users/Admin/Documents/Personal/Final/Frontend/public/output_web.webm', fourcc, fps, (w, h))

    count = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        out.write(frame)
        count += 1
        if count % 100 == 0:
            print(f"Processed {count} frames...")

    cap.release()
    out.release()
    print(f"Conversion complete. Total frames: {count}")

if __name__ == '__main__':
    convert()
