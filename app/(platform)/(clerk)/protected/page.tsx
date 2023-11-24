// import { auth, currentUser } from "@clerk/nextjs";

// async function ProtectedPage() {
//   const user = await currentUser();
//   const { userId } = auth();
//   return (
//     <div>
//       User: {user?.firstName} userId: {userId}
//     </div>
//   );
// }

// export default ProtectedPage;

"use client";

import { UserButton } from "@clerk/nextjs";

function ProtectedPage() {
  return (
    <div>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}

export default ProtectedPage;
