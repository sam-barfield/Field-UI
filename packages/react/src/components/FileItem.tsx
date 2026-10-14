'use client';

import React, { forwardRef, useId } from 'react';
import { Download, ExternalLink, File, FileImage, FileSpreadsheet, FileText, Maximize2 } from 'lucide-react';
import { getInteractiveElementProps, mergeClassNames, renderPolymorphic, useResolvedTag } from '../utils/polymorphic.js';

export type FileItemType = 'image' | 'pdf' | 'document' | 'spreadsheet' | 'file';

const EXTENSIONS: Record<string, FileItemType> = {
  pdf: 'pdf',
  jpg: 'image', jpeg: 'image', png: 'image', gif: 'image', webp: 'image', avif: 'image', svg: 'image', heic: 'image',
  doc: 'document', docx: 'document', odt: 'document', rtf: 'document', txt: 'document', pages: 'document',
  xls: 'spreadsheet', xlsx: 'spreadsheet', ods: 'spreadsheet', csv: 'spreadsheet', numbers: 'spreadsheet',
};

/** The file type from a URL's extension (query and hash ignored); `file` when unknown. */
export const getFileType = (href?: string): FileItemType => {
  const path = (href ?? '').split(/[?#]/)[0];
  const ext = /\.([a-z0-9]+)$/i.exec(path)?.[1]?.toLowerCase();
  return (ext && EXTENSIONS[ext]) || 'file';
};

const TYPE_LABELS: Record<FileItemType, string> = {
  image: 'Image',
  pdf: 'PDF',
  document: 'Document',
  spreadsheet: 'Spreadsheet',
  file: 'File',
};

const TYPE_ICONS: Record<FileItemType, React.ElementType> = {
  image: FileImage,
  pdf: FileText,
  document: FileText,
  spreadsheet: FileSpreadsheet,
  file: File,
};

export interface FileItemProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'children'>,
    Pick<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'download' | 'target' | 'rel' | 'hrefLang' | 'referrerPolicy'> {
  /** The file's name. Bold; long names wrap. */
  name: React.ReactNode;
  /**
   * Renders a link. PDFs open in a new tab; other files get `download` (same-origin files only: the
   * browser opens files from other domains instead). Override with `target` or `download`.
   */
  href?: string;
  /** Renders a button instead of a link, e.g. to open a `Lightbox`. */
  onView?: () => void;
  /** Picks the icon and the type label. Default: from the `href` extension, else `file`. */
  type?: FileItemType;
  /** A portrait preview (2.5 × 3.25rem, cropped from the top) in place of the icon. */
  thumbnail?: string;
  /**
   * The line under the name. Default by action: "PDF · Opens in a new tab", "Spreadsheet ·
   * Download", "View full size". Pass your own to add a file size, e.g. `PDF · 240 KB`.
   */
  meta?: React.ReactNode;
  /** Render as a different element or component. */
  as?: React.ElementType;
  disabled?: boolean;
}

/**
 * An attachment row: a file-type icon or thumbnail, the name, a meta line and an action icon. The
 * whole row is one link (`href`) or button (`onView`). Stack them in a `FileList`.
 *
 * @example
 * <FileItem name="Booking form" href="/files/booking-form.pdf" />
 * <FileItem name="Event poster" thumbnail={posterThumb} type="image" onView={() => setOpen(true)} />
 */
export const FileItem = forwardRef<HTMLElement, FileItemProps>(
  (
    {
      name,
      href,
      onView,
      type: typeProp,
      thumbnail,
      meta,
      as,
      target: targetProp,
      download: downloadProp,
      rel,
      disabled,
      className = '',
      onClick,
      ...props
    },
    ref
  ) => {
    const type = typeProp ?? getFileType(href);
    const isLink = Boolean(href) && !onView;
    const opensInTab = isLink && (targetProp !== undefined ? targetProp === '_blank' : type === 'pdf' && downloadProp === undefined);
    const download = isLink ? (downloadProp !== undefined ? downloadProp : opensInTab ? undefined : true) : undefined;
    const target = isLink ? (targetProp ?? (opensInTab ? '_blank' : undefined)) : undefined;
    const tag = useResolvedTag(as, isLink ? href : undefined, onView ? 'button' : 'div', { download, target });

    const action = onView ? 'view' : !isLink ? 'none' : opensInTab ? 'open' : download !== undefined && download !== false ? 'download' : 'open';
    const defaultMeta =
      action === 'view'
        ? 'View full size'
        : action === 'open' && opensInTab
        ? `${TYPE_LABELS[type]} · Opens in a new tab`
        : action === 'download'
        ? `${TYPE_LABELS[type]} · Download`
        : TYPE_LABELS[type];
    const ActionIcon = action === 'view' ? Maximize2 : action === 'download' ? Download : action === 'open' ? ExternalLink : null;
    const TypeIcon = TYPE_ICONS[type];

    return renderPolymorphic(
      tag,
      {
        className: mergeClassNames('field-file-item', (isLink || onView) && 'field-file-item-interactive', className),
        ...(isLink || onView ? getInteractiveElementProps(tag, { href: isLink ? href : undefined, disabled }) : {}),
        ...(isLink ? { target, download, rel: rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined) } : {}),
        onClick: onView ? (e: React.MouseEvent<HTMLElement>) => { onClick?.(e); if (!e.defaultPrevented) onView(); } : onClick,
        children: (
          <>
            {thumbnail ? (
              <img className="field-file-item-thumb" src={thumbnail} alt="" loading="lazy" decoding="async" />
            ) : (
              <span className="field-file-item-icon" aria-hidden="true">
                <TypeIcon size={20} />
              </span>
            )}
            <span className="field-file-item-text">
              <span className="field-file-item-name">{name}</span>
              <span className="field-file-item-meta">
                {meta ?? defaultMeta}
                {meta !== undefined && opensInTab && <span className="field-sr-only"> (opens in a new tab)</span>}
              </span>
            </span>
            {ActionIcon && (
              <span className="field-file-item-action" aria-hidden="true">
                <ActionIcon size={18} />
              </span>
            )}
          </>
        ),
        ...props,
      },
      ref
    );
  }
);
FileItem.displayName = 'FileItem';

export interface FileListProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional heading above the rows, e.g. "Attachments". It labels the list. */
  heading?: React.ReactNode;
  /** Heading level. Default `3`; use one below the surrounding heading (e.g. `4` inside a card titled with an `h3`). */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** `FileItem`s; each is wrapped in a list item. */
  children: React.ReactNode;
}

/**
 * Stacks `FileItem` rows as a list, with an optional heading.
 *
 * @example
 * <FileList heading="Attachments" headingLevel={4}>
 *   <FileItem name="Booking form" href="/files/booking-form.pdf" />
 * </FileList>
 */
export const FileList: React.FC<FileListProps> = ({ heading, headingLevel = 3, className = '', children, ...props }) => {
  const headingId = useId();
  const HeadingTag = `h${headingLevel}` as React.ElementType;
  return (
    <div className={mergeClassNames('field-file-list', className)} {...props}>
      {heading && <HeadingTag id={headingId} className="field-file-list-heading">{heading}</HeadingTag>}
      <ul className="field-file-list-items" aria-labelledby={heading ? headingId : undefined}>
        {React.Children.toArray(children).map((child, i) => (
          <li key={React.isValidElement(child) && child.key != null ? child.key : i}>{child}</li>
        ))}
      </ul>
    </div>
  );
};
