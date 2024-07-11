export const getName = (username: string): string => {
  switch (username) {
    case "ajroberts0417":
      return "<@U0764BM894M>";
    case "briansmiley":
      return "<@U075SN59RMM>";
    case "brunoLloret":
      return "<@U07675V6CUB>";
    case "dcsan":
      return "<@U07B15N075W>";
    case "elizasviel":
      return "<@U0769P5AD5J>"; // Norman
    case "dxrendxren":
    case "dxren":
      return "<@U075SN5BV47>";
    case "Hendersonajardimj":
      return "<@U0769P5LUMS>";
    case "sarahbicknell":
      return "<@U0760KZUWK0>";
    case "yablochko8":
    case "yab":
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
