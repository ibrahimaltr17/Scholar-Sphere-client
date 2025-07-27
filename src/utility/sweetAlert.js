import Swal from 'sweetalert2';

export const showSuccess = (title, text) => {
  Swal.fire({
    title: title,
    text: text,
    icon: 'success',
    confirmButtonText: 'OK',
  });
};

export const showError = (title, text) => {
  Swal.fire({
    title: title,
    text: text,
    icon: 'error',
    confirmButtonText: 'Try Again',
  });
};

export const showWarning = (title, text) => {
  Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    confirmButtonText: 'Proceed',
  });
};

export const showConfirmation = (title, text, onConfirm) => {
  Swal.fire({
    title: title,
    text: text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
    }
  });
};