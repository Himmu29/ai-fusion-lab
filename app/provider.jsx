"use client";
import React, { use, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/AppSidebar";
import AppHeader from "./_components/AppHeader";
import { useUser } from "@clerk/nextjs";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import { AiSelectedModelContext } from "@/context/AiSelectedModelContext";
import { DefaultModel } from "@/shared/AiModelsShared";
import { UserDetailContext } from "@/context/UserDetailContext";

function Provider({ children, ...props }) {
  const { user } = useUser();
  const [aiSelectedModels, setAiSelectedModels] = useState(DefaultModel);
  const [userDetail,setUserDetail] = useState();

  const CreateNewUser = async () => {
    // if user exists
    const userRef = doc(db, "users", user?.primaryEmailAddress?.emailAddress);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      console.log("Existing User");
      const userInfo = userSnap.data();
      setAiSelectedModels(userInfo.selectedModelPref);
      setUserDetail(userInfo);
      return;
    } else {
      const userData = {
        name: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
        createdAt: new Date(),
        remainingMsg: 5, // only for Free User
        plan: "Free",
        credits: 1000, // Paid User
      };
      await setDoc(userRef, userData);
      console.log("New User data saved");
      setUserDetail(userData);
    }

    // if not then insert
  };

  useEffect(() => {
    if (user) {
      CreateNewUser();
    }
  }, [user]);

  return (
    <NextThemesProvider
      {...props}
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <UserDetailContext.Provider value={{userDetail,setUserDetail}}>
      <AiSelectedModelContext.Provider value={{ aiSelectedModels, setAiSelectedModels }}>
        <SidebarProvider>
          <AppSidebar />
          <div className="w-full">
            <AppHeader />
            {children}
          </div>
        </SidebarProvider>
      </AiSelectedModelContext.Provider>
      </UserDetailContext.Provider>
    </NextThemesProvider>
  );
}

export default Provider;
