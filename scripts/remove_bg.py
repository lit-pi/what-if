from PIL import Image

def remove_white_background(img_path, out_path, tolerance=235):
    img = Image.open(img_path).convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        r, g, b, a = item
        if r >= tolerance and g >= tolerance and b >= tolerance:
            newData.append((255, 255, 255, 0))
        elif r >= 200 and g >= 200 and b >= 200:
            # 边缘柔化平滑过渡
            avg = (r + g + b) / 3.0
            factor = (235.0 - avg) / (235.0 - 200.0)
            alpha = int(max(0, min(255, 255 * factor)))
            newData.append((r, g, b, alpha))
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(out_path, "PNG")
    print(f"Successfully processed {img_path} -> transparent PNG.")

if __name__ == "__main__":
    remove_white_background("assets/char_aslan.png", "assets/char_aslan.png")
    remove_white_background("assets/char_aslan.png", "assets/char_aslan_knight.png")
    remove_white_background("assets/char_aslan.png", "assets/char_aslan_strategist.png")
