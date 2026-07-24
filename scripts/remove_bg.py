from PIL import Image
from collections import deque

def remove_bg_flood_fill(img_path, out_path, color_threshold=235):
    img = Image.open(img_path).convert("RGBA")
    width, height = img.size
    pixels = img.load()

    visited = set()
    queue = deque()

    # Seed 4 corners & top edge
    for x in range(width):
        r, g, b, a = pixels[x, 0]
        if r >= color_threshold and g >= color_threshold and b >= color_threshold:
            queue.append((x, 0))
            visited.add((x, 0))

    while queue:
        x, y = queue.popleft()
        pixels[x, y] = (255, 255, 255, 0)

        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nx, ny = x + dx, y + dy
            if 0 <= nx < width and 0 <= ny < height and (nx, ny) not in visited:
                r, g, b, a = pixels[nx, ny]
                if r >= color_threshold and g >= color_threshold and b >= color_threshold:
                    visited.add((nx, ny))
                    queue.append((nx, ny))

    img.save(out_path, "PNG")
    print(f"BFS Flood fill bg removed: {out_path}")

if __name__ == "__main__":
    src = "/Users/coding-pi/.gemini/antigravity-ide/brain/2a2fe350-46b1-41c7-8710-bb5bac49ef51/char_aslan_dark_fantasy_1784889687840.png"
    remove_bg_flood_fill(src, "assets/char_aslan.png")
    remove_bg_flood_fill(src, "assets/char_aslan_knight.png")
    remove_bg_flood_fill(src, "assets/char_aslan_strategist.png")
