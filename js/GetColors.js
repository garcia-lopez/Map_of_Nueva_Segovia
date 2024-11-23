export const getColors = {

    Urbana: function getUrbana(d) {
        return d >= 7870 && d <= 25264 ? '#FF69B4' :  // Hot Pink
               d >= 2186 && d < 7870  ? '#FF85B3' :  // Bright Pink
               d >= 1118 && d < 2186  ? '#FFA6C9' :  // Light Pink
               d >= 408 && d < 1118   ? '#FFC4A3' :  // Peach
               d >= 203 && d < 408    ? '#FFE3B3' :  // Pastel Peach
                                        '#FFF8C4';   // Light Yellow
     },
    Rural: function getRural(d) {
        return d >= 12871 && d <= 20088 ? '#FF69B4' :  // Hot Pink
               d >= 4565  && d < 12871 ? '#FF85B3' :  // Bright Pink
               d >= 3764  && d < 4565  ? '#FFA6C9' :  // Light Pink
               d >= 3290  && d < 3764  ? '#FFC4A3' :  // Peach
               d >= 812   && d < 3290  ? '#FFE3B3' :  // Pastel Peach
                                         '#FFF8C4';   // Light Yellow
    },
    Viviendas_: function getColorForViviendas(d) {
        return d >= 3668 && d <= 7189 ? '#FF69B4' :  // Hot Pink
               d >= 1791 && d < 3668 ? '#FF85B3' :  // Bright Pink
               d >= 838  && d < 1791 ? '#FFA6C9' :  // Light Pink
               d >= 654  && d < 838  ? '#FFC4A3' :  // Peach
               d >= 553  && d < 654  ? '#FFE3B3' :  // Pastel Peach
                                       '#FFF8C4';   // Light Yellow
    },
    VIV_Urbana: function getColorForVIV_Urbana(d) {
        return d >= 1287 && d <= 4549 ? '#FF69B4' :  // Hot Pink
               d >= 402  && d < 1287 ? '#FF85B3' :  // Bright Pink
               d >= 194  && d < 402  ? '#FFA6C9' :  // Light Pink
               d >= 74   && d < 194  ? '#FFC4A3' :  // Peach
               d >= 34   && d < 74   ? '#FFE3B3' :  // Pastel Peach
                                        '#FFF8C4';   // Light Yellow
    },
    VIV_Rurale: function getColorForVIV_Rurale(d) {
        return d >= 2070 && d <= 3377 ? '#FF69B4' :  // Hot Pink
               d >= 678  && d < 2070 ? '#FF85B3' :  // Bright Pink
               d >= 605  && d < 678  ? '#FFA6C9' :  // Light Pink
               d >= 479  && d < 605  ? '#FFC4A3' :  // Peach
               d >= 126  && d < 479  ? '#FFE3B3' :  // Pastel Peach
                                       '#FFF8C4';   // Light Yellow
    }

};