import { useEffect } from 'react';
import { Share2, Settings, HardDrive } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUIStore } from '../../store/uiStore';
import { useFolders } from '../../hooks/useFolders';
import { FolderTree } from '../folders/FolderTree';
import './Sidebar.css';

export const Sidebar = () => {
  const { sidebarOpen, setSidebarOpen, setCurrentFolderId } = useUIStore();
  const { folderTree, fetchFolderTree } = useFolders();
  const safeFolderTree = Array.isArray(folderTree) ? folderTree : [];

  useEffect(() => {
    fetchFolderTree();
  }, [fetchFolderTree]);

  const handleFolderSelect = (folderId: string) => {
    setCurrentFolderId(folderId);
    setSidebarOpen(false);
  };

  return (
    <>
      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <nav className="sidebar-nav">
          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Main</h3>
            <Link to="/dashboard" className="sidebar-nav-item">
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
              <button className="sidebar-add-folder-btn" title="Add folder">
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
            <Link to="/dashboard" className="sidebar-nav-item">
              <Settings size={20} />
              <span>Dashboard</span>
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
};
