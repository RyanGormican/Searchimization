import React from 'react';
import { Icon } from '@iconify/react';

interface HelpModalProps {
  type: string;
  helpModal: boolean;
  setHelpModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const HelpModal: React.FC<HelpModalProps> = ({ type, helpModal, setHelpModal }) => {
  return (
    <>
      {helpModal && (
        <div id="static-modal" data-modal-backdrop="static" tabIndex={-1} aria-hidden="true" className="fixed top-0 right-0 bottom-0 left-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow-lg">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <button type="button" onClick={() => setHelpModal(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                  <Icon icon="bi:slash-circle" width="20" />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="p-4 md:p-5 space-y-4">
                {type === 'CrosswordCreate' && (
                  <div className="text-center">
                    <h1 className="text-xl font-semibold mb-4">Crossword Creation Help</h1>
                    <p className="text-gray-700">Here are instructions on how to create your crossword:</p>

                    <p>Step 1: Start by entering the name of your crossword at the top input that says 'My Puzzle'.</p>
                    <p>Step 2: Click on each grid cell to input letters. Words are thrown into across and down categories at &gt;=3 characters.</p>
                    <p>Step 3: Using the left and right tables for across and down, edit the description input boxes to write clues for your words.</p>
                    <p>Step 4: When you are done, click the 'Upload' button to save your crossword.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpModal;
