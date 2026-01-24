"use client";
import React, { use, useEffect } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/AppSidebar";
import AppHeader from "./_components/AppHeader";
import { useUser } from "@clerk/nextjs";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";

function Provider({ children, ...props }) {

  const {user} = useUser();

  const CreateNewUser = async ()=>{
    // if user exists
    const userRef = doc(db,"users",user?.primaryEmailAddress?.emailAddress);
    const userSnap = await getDoc(userRef);

    if(userSnap.exists()){
      console.log("Existing User");
      return;
    }else{
      const userData={
        name: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
        createdAt: new Date(),
        remainingMsg:5,  // only for Free User
        plan:'Free',
        credits:1000  // Paid User
      }
      await setDoc(userRef,userData);
      console.log("New User data saved");
    }

    // if not then insert
  }

  useEffect(()=>{
    if(user){
      CreateNewUser();
    }
  },[user])

  return (
    <NextThemesProvider
      {...props}
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <AppSidebar />
        <div className="w-full">
          <AppHeader />
          {children}
        </div>
      </SidebarProvider>
    </NextThemesProvider>
  );
}

export default Provider;
