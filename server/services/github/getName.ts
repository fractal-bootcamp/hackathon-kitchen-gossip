export const getName = (username: string): string => {
  switch (username) {
    case "briansmiley":
      return "@Brian";
    case "brunoLloret":
      return "@Bruno";
    case "elizasvielelizasviel":
      return "<@Norman Qian>";
    case "dxrendxren":
      return "<@Dorothy>";
    case "sarahbicknell":
      return "@Sarah";
    case "yablochko8":
      return "<@Lui>";
    case "yayakixtenet":
    case "yayakix":
      return "@Iyana";
    default:
      return username;
  }
};
