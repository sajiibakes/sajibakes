from PIL import Image

def remove_black_bg(input_path, output_path, threshold=50):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    
    new_data = []
    for item in datas:
        # Check if the pixel is dark enough to be considered "black"
        if item[0] < threshold and item[1] < threshold and item[2] < threshold:
            # Change all dark pixels to transparent
            new_data.append((0, 0, 0, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(output_path, "PNG")

remove_black_bg("sajibakes_logo.jpeg", "sajibakes_logo.png")
print("Saved transparent logo.")
