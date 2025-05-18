// Update imports at the top of the file
import ArchiveViewerModal from '../components/ArchiveViewerModal';

// Add state for archive modal
const [showArchiveModal, setShowArchiveModal] = useState(false);

// Add button to view archives in the controls section
<div className="flex gap-4">
  <button
    onClick={() => setShowArchiveModal(true)}
    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
  >
    View Archives
  </button>

  <button
    onClick={handleClearTable}
    disabled={clearing}
    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
  >
    {clearing ? (
      <>
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Clearing...
      </>
    ) : (
      <>
        <Trash2 className="mr-2 h-5 w-5" />
        Clear All
      </>
    )}
  </button>

  <button
    onClick={exportToCSV}
    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
  >
    <Download className="h-5 w-5 mr-2" />
    Export to CSV
  </button>
</div>

// Add the modal component at the bottom of the render tree
<ArchiveViewerModal
  isOpen={showArchiveModal}
  onClose={() => setShowArchiveModal(false)}
  type="tech-conference"
/>