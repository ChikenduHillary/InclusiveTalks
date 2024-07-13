import React, { ReactNode, useContext, useState, createContext } from "react";

export interface Blog {
  id: string;
  likes?: number;
  comments?: string[]; // assuming comments are strings, change as needed
  views?: number;
  writtenBy: string;
  content: string;
  title: string;
  createdAt?: string | Date | undefined;
  updatedAt?: string | Date | undefined;
  authorId: string;
  imgUrl: string;
  audioUrl?: string;
  postedBy?: string; // no need for null or undefined if optional
}

interface AppState {
  blogs: Blog[];
}

interface AppContextProps {
  state: AppState;
  setBlogs: (blogs: Blog[]) => void;
}

const defaultState: AppState = {
  blogs: [],
};

const AppContext = createContext<AppContextProps>({
  state: defaultState,
  setBlogs: () => {},
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>(defaultState);

  const setBlogs = (blogs: Blog[]) => {
    setState((prevState) => ({
      ...prevState,
      blogs,
    }));
  };

  return (
    <AppContext.Provider value={{ state, setBlogs }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
