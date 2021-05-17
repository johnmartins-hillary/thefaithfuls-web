import * as PapaParse from "papaparse";
import {useSelector} from "react-redux"
import {AppState} from "store"
import {breakpoints} from "store/System/types"

export const downloadFile = (data: any[], name: string) => {
  const downloadFile = PapaParse.unparse(data);

  const hiddenElement = document.createElement("a");
  hiddenElement.href = `data:text/csv;charset=utf-8,${encodeURI(downloadFile)}`;
  hiddenElement.target = "_blank";
  hiddenElement.download = `${name}.csv`;
  hiddenElement.click();
};

export const uploadMedia = async (
  firebase: any,
  userId: string,
  mediaFile: File
) => {
  const filePath = `/media/${userId}/${mediaFile.name}-${new Date().getTime()}`;
  const storageRef = firebase.storage().ref(filePath);
  try {
    const response = await storageRef.put(mediaFile);
    const imageUrl = await response.ref.getDownloadURL();
    return {
      filePath,
      imageUrl,
    };
  } catch (err) {
    throw err;
  }
};

export const useBreakpoints = () => {
  const currentBreakpoints = useSelector(
    (state:AppState) => state.system.currentBreakpoints
  );
  const baseOnBreakpoints = (
    breakpoints: breakpoints,
    arr1: any[],
    arr2 = []
  ) => (currentBreakpoints !== breakpoints ? arr1 : arr2);

  return { baseOnBreakpoints, currentBreakpoints };
};
