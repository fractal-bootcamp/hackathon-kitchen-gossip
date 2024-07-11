export const getName = (username: string): string => {
  switch (username) {
    case "briansmiley":
      return "@Brian";
    case "brunoLloret":
      return "<@U07675V6CUB>";
    case "elizasvielelizasviel":
      return "<@U0769P5AD5J>"; // Norman
    case "dxrendxren":
      return "<@U075SN5BV47>";
    case "sarahbicknell":
      return "@Sarah";
    case "yablochko8":
      return "<@U076W321UJC>";
    case "yayakixtenet":
    case "yayakix":
      return "@Iyana";
    default:
      return username;
  }
};
