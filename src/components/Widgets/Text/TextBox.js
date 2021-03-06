import TextEditor from './Text';

function TextBox({ element, mode }) {
  const Viewer = ({ content }) => {
    return (
      <div
        className='ck-content'
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };
  return mode === 'normal' ? (
    <Viewer content={element.widget_data.thumbnail} />
  ) : (
    <TextEditor widgetId={element.i} />
  );
}

export default TextBox;
