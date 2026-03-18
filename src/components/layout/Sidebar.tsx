import { useCallback, useEffect } from 'react';
import { Share2, Settings, HardDrive } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUIStore } from '../../store/uiStore';
import { useFolders } from '../../hooks/useFolders';
import { FolderTree } from '../folders/FolderTree';
import './Sidebar.css';

export const Sidebar = () => {
  const { sidebarOpen, setSidebarOpen, setCurrentFolderId, currentFolderId, addToast } = useUIStore();
  const { folderTree, fetchFolderTree, createFolder } = useFolders();
  const safeFolderTree = Array.isArray(folderTree) ? folderTree : [];

  useEffect(() => {
    fetchFolderTree();
  }, [fetchFolderTree]);

  const handleFolderSelect = (folderId: string) => {
    setCurrentFolderId(folderId);
    setSidebarOpen(false);
  };

  const handleCreateFolder = useCallback(async () => {
    const folderName = window.prompt('Enter folder name');
    const trimmedName = folderName?.trim();

    if (!trimmedName) {
      return;
    }

    const created = await createFolder(trimmedName, currentFolderId || undefined);
    if (!created) {
      addToast('Failed to create folder', 'error');
      return;
    }

    addToast(`Folder "${trimmedName}" created`, 'success');
    await fetchFolderTree();
  }, [createFolder, currentFolderId, fetchFolderTree, addToast]);

  return (
    <>
      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <nav className="sidebar-nav">
          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Main</h3>
            <Link to="/files" className="sidebar-nav-item">
              <HardDrive size={20} />
              <span>My Files</span>
            </Link>
            <Link to="/shared" className="sidebar-nav-item">
              <Share2 size={20} />
              <span>Shared With Me</span>
            </Link>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-header">
              <h3 className="sidebar-section-title">Folders</h3>
              <button type="button" className="sidebar-add-folder-btn" title="Add folder" onClick={handleCreateFolder}>
                +
              </button>
            </div>
            {safeFolderTree.length > 0 ? (
              <div className="sidebar-folder-tree">
                {safeFolderTree.map((folder) => (
                  <FolderTree
                    key={folder.id}
                    node={folder}
                    onSelect={handleFolderSelect}
                  />
                ))}
              </div>
            ) : (
              <p className="sidebar-empty">No folders yet</p>
            )}
          </div>

          <div className="sidebar-section">
            <Link to="/settings" className="sidebar-nav-item">
              <Settings size={20} />
              <span>Settings</span>
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
};
