import { ModalProps } from "react-native";
import { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";

export interface CommentsModalProps extends ModalProps {
  postId: number;
  onRequestClose?: () => void;
}

export interface CustomBackdropProps extends BottomSheetBackdropProps {
  onClose: () => void;
}
