//This file handles the image upload function
//This slides the image in 9 squares and shuffles it

//This function takes and processes the image
export function processImage(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.match("image/jpeg") && !file.type.match("image/png")) {
      reject(new Error("Please upload a .jpg or .png image"));
      return;
    }

    //Creates a fileReader to read the file
    const reader = new FileReader();

    //When the file is loaded, then prccess it
    reader.onload = (event) => {
      const img = new Image(); //Create a HTML image element

      //When the image is loaded, then slice it
      img.onload = () => {
        const tiles = sliceImage(img); //cut into 9
        resolve(tiles); //returns array of image URLs
      };

      img.oneerror = () => reject(new Error("Failes to load image"));
      img.src = event.target.result; //Set image source to the file data
    };

    reader.oneerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file); //read the file as a data URL
  });
}

//This function takes the laoded HTML and cuts it into 9 equal tiles
function sliceImage(img) {
  const tiles = []; //Will hold 9 tile images URLs

  //Figure the size of square crop
  const size = Math.min(img.width, img.height);

  //Calculate where to start cropping
  const startX = (img.width - size) / 2;
  const startY = (img.height - size) / 2;

  //Each tile is one third of the titla square size
  const tileSize = size / 3;

  //Loop through each row and column to create 9 tiles
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      //the last tile becomes blank
      if (row === 2 && col === 2) {
        tiles.push(null);
        continue;
      }

      //Creates a canvas to draw specific tile onto
      const canvas = document.createElement("canvas");
      canvas.width = tileSize; //tile width
      canvas.height = tileSize; //tile height

      const ctx = canvas.getContext("2d");

      //draw just this lies portion of the original image
      ctx.drawImage(
        img,
        startX + col * tileSize,
        startY + row * tileSize,
        tileSize,
        tileSize,
        0,
        0,
        tileSize,
        tileSize,
      );

      //Convert the canvas to a data URL and store it
      tiles.push(canvas.toDataURL());
    }
  }

  return tiles; //array of 9 items, 8 imgs puls 1 null
}
