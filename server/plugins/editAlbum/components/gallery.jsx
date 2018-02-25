/* global GetGalleryNames */
const propTypes = require('prop-types');
const React = require('react');

class GalleryDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.galleryOptions = this.props.galleries.map((gallery) => {
      const id = `gallery-${gallery}`;
      return <option key={id} value={gallery}>{gallery}</option>;
    });
  }

  render() {
    return (
      <section>
        Gallery
        <select id="editGalleries" tabIndex="1" onChange={GetGalleryNames}>
          <option key="gallery-none" value="">Select gallery</option>
          {this.galleryOptions}
        </select>
        <input type="button" id="changeGallery" value="View" />
      </section>
    );
  }
}

GalleryDropdown.propTypes = {
  galleries: propTypes.arrayOf(propTypes.string).isRequired
};

module.exports = GalleryDropdown;