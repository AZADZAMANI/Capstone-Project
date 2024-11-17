// src/components/ConfirmModal.js

import React from 'react';
import Modal from 'react-modal';
import './ConfirmModal.css'; 

Modal.setAppElement('#root');

const ConfirmModal = ({
  isOpen,
  onRequestClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Yes',
  cancelText = 'No',
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Confirmation Modal"
      className="modal"
      overlayClassName="overlay"
    >
      <h2 className="modal-title">{title}</h2>
      <p className="modal-message">{message}</p>
      <div className="modal-buttons">
        <button onClick={onConfirm} className="confirm-button">
          {confirmText}
        </button>
        <button onClick={onRequestClose} className="cancel-button">
          {cancelText}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
