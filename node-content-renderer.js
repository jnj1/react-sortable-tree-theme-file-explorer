import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './node-content-renderer.scss';

function isDescendant(older, younger) {
  return (
    !!older.children &&
    typeof older.children !== 'function' &&
    older.children.some(
      child => child === younger || isDescendant(child, younger)
    )
  );
}

// eslint-disable-next-line react/prefer-stateless-function
class FileThemeNodeContentRenderer extends Component {
  render() {
    const {
      scaffoldBlockPxWidth,
      toggleChildrenVisibility,
      connectDragPreview,
      connectDragSource,
      isDragging,
      canDrop,
      canDrag,
      node,
      title,
      draggedNode,
      path,
      treeIndex,
      isSearchMatch,
      isSearchFocus,
      icons,
      buttons,
      className,
      style,
      didDrop,
      lowerSiblingCounts,
      listIndex,
      swapFrom,
      swapLength,
      swapDepth,
      treeId, // Not needed, but preserved for other renderers
      isOver, // Not needed, but preserved for other renderers
      parentNode, // Needed for dndManager
      rowDirection,
      ...otherProps
    } = this.props;
    const nodeTitle = title || node.title;

    const isDraggedDescendant = draggedNode && isDescendant(draggedNode, node);
    const isLandingPadActive = !didDrop && isDragging;

    // Construct the scaffold representing the structure of the tree
    const scaffold = [];

    for (let i = 0; i < path.length - 1; i++) {
      scaffold.push(
        <div
          style={{ width: scaffoldBlockPxWidth }}
          className={styles.lineChildren}
        />
      );


    }

    scaffold.push(
      <div
        style={{
          width: scaffoldBlockPxWidth,
          left: scaffoldBlockPxWidth,
        }}
        className={styles.lineBlock}
      />
    );


    let iconChar;

    switch (node.classname) {
      case 'compound':
        iconChar = 'C';
        break;
      case 'study':
        iconChar = 'S';
        break;
      case 'reporting-effort':
        iconChar = 'R';
        break;
      case 'table':
        iconChar = 'T';
        break;
      case 'listing':
        iconChar = 'L';
        break;
      case 'graph':
        iconChar = 'G';
        break;
      case 'column-layout':
        iconChar = 'C';
        break;
      case 'footnote-group':
        iconChar = 'F';
        break;
      default:
        iconChar = '';
        break;
    }

    const nodeContent = (
      <div style={{ height: '100%' }} {...otherProps}>
        {toggleChildrenVisibility &&
          node.children &&
          node.children.length > 0 && (
            <button
              type="button"
              aria-label={node.expanded ? 'Collapse' : 'Expand'}
              className={
                node.expanded ? styles.collapseButton : styles.expandButton
              }
              style={{
                left: (lowerSiblingCounts.length - 0.7) * scaffoldBlockPxWidth,
              }}
              onClick={() =>
                toggleChildrenVisibility({
                  node,
                  path,
                  treeIndex,
                })
              }
            />
          )}

        {toggleChildrenVisibility &&
          (!node.children ||
          node.children.length === 0) && (
          <div
            style={{
              left: (path.length - 1) * scaffoldBlockPxWidth,
              position: 'absolute',
              border: 'solid 1px black',
              fontSize: 8,
              textAlign: 'center',
              marginRight: 10,
              width: '12px',
              height: '16px',
              lineHeight: '16px',
            }}>
            {iconChar}
          </div>
          )}

        <div
          className={
            styles.rowWrapper +
            (!canDrag ? ` ${styles.rowWrapperDragDisabled}` : '')
          }
        >
          {/* Set the row preview to be used during drag and drop */}
          {connectDragPreview(
            <div style={{ display: 'flex' }}>
              {scaffold}
              <div
                className={
                  styles.row +
                  (isLandingPadActive ? ` ${styles.rowLandingPad}` : '') +
                  (isLandingPadActive && !canDrop
                    ? ` ${styles.rowCancelPad}`
                    : '') +
                  (isSearchMatch ? ` ${styles.rowSearchMatch}` : '') +
                  (isSearchFocus ? ` ${styles.rowSearchFocus}` : '') +
                  (className ? ` ${className}` : '')
                }
                style={{
                  opacity: isDraggedDescendant ? 0.5 : 1,
                  ...style,
                }}
              >
                <div
                  className={
                    styles.rowContents +
                    (!canDrag ? ` ${styles.rowContentsDragDisabled}` : '')
                  }
                >
                  <div className={styles.rowToolbar}>
                    {icons.map((icon, index) => (
                      <div
                        key={index} // eslint-disable-line react/no-array-index-key
                        className={styles.toolbarButton}
                      >
                        {icon}
                      </div>
                    ))}
                  </div>
                  <div className={styles.rowLabel}>
                    <span className={styles.rowTitle}>
                      {typeof nodeTitle === 'function'
                        ? nodeTitle({
                            node,
                            path,
                            treeIndex,
                          })
                        : nodeTitle}
                    </span>
                  </div>

                  <div className={styles.rowToolbar}>
                    {buttons.map((btn, index) => (
                      <div
                        key={index} // eslint-disable-line react/no-array-index-key
                        className={styles.toolbarButton}
                      >
                        {btn}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );

    return canDrag
      ? connectDragSource(nodeContent, { dropEffect: 'copy' })
      : nodeContent;
  }
}

FileThemeNodeContentRenderer.defaultProps = {
  buttons: [],
  canDrag: false,
  canDrop: false,
  className: '',
  draggedNode: null,
  icons: [],
  isSearchFocus: false,
  isSearchMatch: false,
  parentNode: null,
  style: {},
  swapDepth: null,
  swapFrom: null,
  swapLength: null,
  title: null,
  toggleChildrenVisibility: null,
};

FileThemeNodeContentRenderer.propTypes = {
  buttons: PropTypes.arrayOf(PropTypes.node),
  canDrag: PropTypes.bool,
  className: PropTypes.string,
  icons: PropTypes.arrayOf(PropTypes.node),
  isSearchFocus: PropTypes.bool,
  isSearchMatch: PropTypes.bool,
  listIndex: PropTypes.number.isRequired,
  lowerSiblingCounts: PropTypes.arrayOf(PropTypes.number).isRequired,
  node: PropTypes.shape({}).isRequired,
  path: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ).isRequired,
  scaffoldBlockPxWidth: PropTypes.number.isRequired,
  style: PropTypes.shape({}),
  swapDepth: PropTypes.number,
  swapFrom: PropTypes.number,
  swapLength: PropTypes.number,
  title: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  toggleChildrenVisibility: PropTypes.func,
  treeIndex: PropTypes.number.isRequired,
  treeId: PropTypes.string.isRequired,
  rowDirection: PropTypes.string.isRequired,

  // Drag and drop API functions
  // Drag source
  connectDragPreview: PropTypes.func.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  didDrop: PropTypes.bool.isRequired,
  draggedNode: PropTypes.shape({}),
  isDragging: PropTypes.bool.isRequired,
  parentNode: PropTypes.shape({}), // Needed for dndManager
  // Drop target
  canDrop: PropTypes.bool,
  isOver: PropTypes.bool.isRequired,
};

export default FileThemeNodeContentRenderer;
