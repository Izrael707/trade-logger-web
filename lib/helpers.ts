import Swal from "sweetalert2";
export const closeAlert = () => Swal.close()
export const showLoading = (message: string) => {
  Swal.fire({
    toast: true,
    icon: undefined,
    title: message,
    showConfirmButton: false,
    timer: undefined, 
    timerProgressBar: false,
    position: "top",
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};
export const toast = (
  message: string,
  type: "error" | "success" | "info",
  time: number,
) => {
  Swal.fire({
    // theme: "dark",
    toast: true,
    icon: type,
    text: message,
    showConfirmButton: false,
    timer: time,
    timerProgressBar: true,
    position: 'top'
  });
};
