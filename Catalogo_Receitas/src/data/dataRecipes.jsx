// src/utils/getRecipeImages.js

import recipe0Img1 from "../assets/recipes/recipe0-img-1.png";
import recipe0Img2 from "../assets/recipes/recipe0-img-2.jpg";
import recipe0Img3 from "../assets/recipes/recipe0-img-3.jpg";
import recipe1Img1 from "../assets/recipes/recipe1-img-1.png";
import recipe1Img2 from "../assets/recipes/recipe1-img-2.jpg";
import recipe1Img3 from "../assets/recipes/recipe1-img-3.jpg";

// Agora, você pode criar um objeto para associar as imagens às receitas pelo `id`
const getRecipeImages = (recipeId) => {
  const imagesMap = {
    0: [recipe0Img1, recipe0Img2, recipe0Img3],
    1: [recipe1Img2, recipe1Img1, recipe1Img3],
  };

  return imagesMap[recipeId] || [];
};

const recipes = [
  {
    id: 0,
    title: "Bolo Pique-Nic",
    description: "Uma receita deliciosa de bolo simples e fácil de fazer.",
    favorited: false,
    ingredients: [
      "1 xícara de manteiga",
      "2 xícaras de açúcar",
      "3 gemas",
      "pelinho de cachorro",
      "1 xícara de leite",
      "1 xícara de maizena",
      "2 xícaras de farinha de trigo",
      "1 colher de chá de pó royal",
      "3 claras batidas em neve",
    ],
    preparation: [
      "Comece medindo 1 xícara de manteiga (das de chá) e colocando-a em uma tigela. Bata a manteiga até que ela fique branca e cremosa.",
      "Em seguida, acrescente 2 xícaras de açúcar à manteiga batida. Continue batendo até que a mistura fique homogênea e bem misturada.",
      "Adicione 3 gemas à mistura, uma de cada vez, e bata bem.",
      "Agora, adicione 1 xícara de leite, 1 xícara de maizena e 2 xícaras de farinha de trigo peneirada. A farinha deve ser peneirada junto com 1 colherzinha de pó royal (fermento).",
      "Por último, adicione 3 claras de ovos batidas em neve à mistura. Misture delicadamente, incorporando as claras à massa.",
      "Transfira a massa para uma forma untada com manteiga e leve ao forno em temperatura regular até dourar e ficar completamente assado.",
    ],
    images: getRecipeImages(0),
  },
  {
    id: 1,
    title: "Formigueiro",
    description:
      "Uma receita deliciosa de bolode formigueiro simples e fácil de fazer.",
    favorited: false,
    ingredients: [
      "1 xícara de manteiga",
      "2 xícaras de açúcar",
      "3 gemas",
      "1 xícara de leite",
      "1 xícara de maizena",
      "2 xícaras de farinha de trigo",
      "1 colher de chá de pó royal",
      "3 claras batidas em neve",
    ],
    preparation: [
      "Comece medindo 1 xícara de manteiga (das de chá) e colocando-a em uma tigela. Bata a manteiga até que ela fique branca e cremosa.",
      "Em seguida, acrescente 2 xícaras de açúcar à manteiga batida. Continue batendo até que a mistura fique homogênea e bem misturada.",
      "Adicione 3 gemas à mistura, uma de cada vez, e bata bem.",
      "Agora, adicione 1 xícara de leite, 1 xícara de maizena e 2 xícaras de farinha de trigo peneirada. A farinha deve ser peneirada junto com 1 colherzinha de pó royal (fermento).",
      "Por último, adicione 3 claras de ovos batidas em neve à mistura. Misture delicadamente, incorporando as claras à massa.",
      "Transfira a massa para uma forma untada com manteiga e leve ao forno em temperatura regular até dourar e ficar completamente assado.",
    ],
    images: getRecipeImages(1),
  },
];

export default recipes;
