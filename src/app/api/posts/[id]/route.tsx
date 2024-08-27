// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function getPostsByCategory(categoryId: number) {
//   console.log(`Recherche des posts pour la catégorie ID: ${categoryId}`);
  
//   const posts = await prisma.post.findMany({
//     where: {
//       categoryId: categoryId,
//     },
//     include: {
//       category: true,
//       type: true,
//       Detail: true,
//       DateReserve: true,
//     },
//   });

//   console.log(`Posts trouvés:`, posts);

//   return posts;
// }

// getPostsByCategory(1).then(posts => {
//   if (posts.length === 0) {
//     console.log("Aucun post trouvé pour cette catégorie.");
//   } else {
//     console.log(posts);
//   }
// });

