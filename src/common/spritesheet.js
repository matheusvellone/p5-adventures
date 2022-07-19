export const loadSpriteSheet = (image, widthStep, heightStep = widthStep) => {
  const sprites = []

  for (let width = 0; width < image.width; width += widthStep) {
    for (let height = 0; height < image.height; height += heightStep) {
      sprites.push(image.get(width, height, widthStep, heightStep))
    }
  }

  return sprites
}
