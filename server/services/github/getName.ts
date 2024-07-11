export const getName = (username: string): string => {
  switch (username) {
    case "briansmiley":
      return "<@U075SN59RMM>";
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
      return "<@U076KUTQRR7>";
    default:
      console.log(
        "name not identified by getName function, just returning:",
        username
      );
      return username;
  }
};
