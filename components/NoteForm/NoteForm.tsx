import{ createNote, type CreateNoteParams } from '../../lib/api';
import css from './NoteForm.module.css';
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface NoteFormProps {
  onClose: () => void;
}

const NoteSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Занадто короткий!")
    .max(50, "Занадто довгий!")
    .required("Це поле обов'язкове"),
  content: Yup.string()
    .max(500, "Максимум 500 символів"),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'], "Оберіть тег зі списку")
    .required("Оберіть тег")
});

function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();
  
  const {mutate,isPending} = useMutation({
    mutationFn: createNote,
    onSuccess: () =>{
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onClose();
    },
    onError: () => {
      alert("Error creating note!");
    }
  })

  const initialValues: CreateNoteParams = {
    title: "",
    content: "",
    tag: "Todo",
  };

  return (
    <Formik 
      initialValues={initialValues} 
      validationSchema={NoteSchema} 
      onSubmit={(values: CreateNoteParams) => mutate(values)}
    >
      {() => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              id="content"
              name="content"
              as="textarea"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage name="content" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field id="tag" name="tag" as="select" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button 
              type="button" 
              className={css.cancelButton} 
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isPending}
            >
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default NoteForm;