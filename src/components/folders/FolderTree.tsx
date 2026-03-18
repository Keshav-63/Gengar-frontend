import React, { useState } from 'react';
import { ChevronRight, Folder } from 'lucide-react';
import { FolderTreeNode } from '../../types';
import './FolderTree.css';

interface FolderTreeProps {
  node: FolderTreeNode;
  level?: number;
  onSelect?: (folderId: string) => void;
}

export const FolderTree = ({ node, level = 0, onSelect }: FolderTreeProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    if (onSelect) {
      onSelect(node.id);
    }
  };

  return (
    <div className="folder-tree-node">
      <div
        className="folder-tree-item"
        style={{ paddingLeft: `${level * 16}px` }}
        onClick={handleClick}
      >
        {node.children.length > 0 && (
          <button
            className={`folder-tree-toggle ${isExpanded ? 'expanded' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            <ChevronRight size={16} />
          </button>
        )}
        {!node.children.length && <span className="folder-tree-spacer"></span>}
        <Folder size={16} className="folder-tree-icon" />
        <span className="folder-tree-name">{node.name}</span>
        {node.file_count > 0 && (
          <span className="folder-tree-count">{node.file_count}</span>
        )}
      </div>

      {isExpanded && node.children.length > 0 && (
        <div className="folder-tree-children">
          {node.children.map((child) => (
            <FolderTree
              key={child.id}
              node={child}
              level={level + 1}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};
