from PIL import Image
from collections import deque

def remove_bg_robust(img_path, out_path):
    img = Image.open(img_path).convert("RGBA")
    width, height = img.size
    pixels = img.load()

    visited = set()
    queue = deque()

    # 1. 扫描四个边缘，将所有非深色（背景）像素放入 BFS 队列
    for x in range(width):
        for y in [0, height - 1]:
            r, g, b, a = pixels[x, y]
            if r > 100 and g > 90 and b > 80:
                queue.append((x, y))
                visited.add((x, y))

    for y in range(height):
        for x in [0, width - 1]:
            r, g, b, a = pixels[x, y]
            if r > 100 and g > 90 and b > 80 and (x, y) not in visited:
                queue.append((x, y))
                visited.add((x, y))

    # 2. BFS 泛洪消除所有与边缘连通的浅色背景像素
    while queue:
        x, y = queue.popleft()
        pixels[x, y] = (0, 0, 0, 0)

        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nx, ny = x + dx, y + dy
            if 0 <= nx < width and 0 <= ny < height and (nx, ny) not in visited:
                r, g, b, a = pixels[nx, ny]
                # 凡是 RGB 大于阈值（非黑/紫装甲与头发）均判定为背景
                if r > 120 and g > 110 and b > 100:
                    visited.add((nx, ny))
                    queue.append((nx, ny))

    img.save(out_path, "PNG")
    print(f"Robust background removal completed for {out_path}")

if __name__ == "__main__":
    src = "/Users/coding-pi/.gemini/antigravity-ide/brain/2a2fe350-46b1-41c7-8710-bb5bac49ef51/char_aslan_panicked_1784892475183.png"
    remove_bg_robust(src, "assets/char_aslan_panicked.png")
