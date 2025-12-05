export default function Background({
  loadedImage,
  isPannable,
  renderedWidth,
  smoothMouseX,
  switching
}: {
  loadedImage: string | null;
  isPannable: boolean;
  renderedWidth: number;
  smoothMouseX: number;
  switching: boolean;
}) {
  const screenW = window.innerWidth;

  const getStyle = () => {
    if (!loadedImage) {
      return {};
    }
    if (!isPannable) {
      return {
        backgroundImage: `url(${loadedImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
    }

    /*
    mouse percentage calculation horizontal[x]
    and offsetting [shifting] image 
    */
    const normalizedX = Math.max(0, Math.min(1, smoothMouseX / screenW));
    const offset = -(renderedWidth - screenW) * normalizedX;

    return {
      backgroundImage: `url(${loadedImage})`,
      backgroundSize: `${renderedWidth}px auto`,
      backgroundPosition: `${offset}px center`,
      backgroundRepeat: 'no-repeat',
      transition: 'background-position 0.05s linear'
    };
  };

  return (
    <div
      className="absolute inset-0 transition-all duration-300"
      style={{
        ...getStyle(),
        filter: switching
          ? 'blur(20px) brightness(0.7)'
          : 'blur(0px) brightness(1)'
      }}
    />
  );
}
