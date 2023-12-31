import { useState } from "react";
import { JSONContent } from "@tiptap/react";
import { v4 as uuid } from "uuid";
import { NoteEditor } from "../../components/NoteEditor";
import { loadNotes, saveNote } from "../../utils";
import { Note, UserData } from "../../types";

import styles from "./styles.module.css";

type NotesPageProps = {
  userData: UserData;
};

export function NotesPage({ userData }: NotesPageProps) {
  const [notes, setNotes] = useState<Record<string, Note>>(() =>
    loadNotes(userData),
  );
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  const activeNote = activeNoteId ? notes[activeNoteId] : null;

  const handleChangeNoteContent = (
    noteId: string,
    content: JSONContent,
    title = "New note",
  ) => {
    const updatedNote = {
      ...notes[noteId],
      updatedAt: new Date(),
      content,
      title,
    };

    setNotes((notes) => ({
      ...notes,
      [noteId]: updatedNote,
    }));

    saveNote(updatedNote, userData);
  };

  const handleCreateNewNote = () => {
    const newNote = {
      id: uuid(),
      title: "New note",
      content: `<h1>New note</h1>`,
      updatedAt: new Date(),
    };

    setNotes((notes) => ({
      ...notes,
      [newNote.id]: newNote,
    }));

    setActiveNoteId(newNote.id);
    saveNote(newNote, userData);
  };

  const handleChangeActiveNote = (id: string) => {
    setActiveNoteId(id);
  };

  const notesList = Object.values(notes).sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
  );

  return (
    <div className={styles.pageContainer}>
      <aside className={styles.sidebar}>
        <button className={styles.sidebarButton} onClick={handleCreateNewNote}>
          New Note
        </button>
        <section className={styles.sidebarList}>
          {notesList.map((note) => (
            <div
              key={note.id}
              role="button"
              tabIndex={0}
              className={
                note.id === activeNoteId
                  ? styles.sidebarItemActive
                  : styles.sidebarItem
              }
              onClick={() => handleChangeActiveNote(note.id)}
            >
              {note.title}
            </div>
          ))}
        </section>
      </aside>
      {!!activeNote ? (
        <NoteEditor
          note={activeNote}
          onChange={(content, title) =>
            handleChangeNoteContent(activeNote.id, content, title)
          }
        />
      ) : (
        <div>Create a new note or select an existing one.</div>
      )}
    </div>
  );
}
