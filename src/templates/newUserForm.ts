export const newUserForm = `
<h2>Add New User</h2>
<div class="formWrapper">
<form id="add-user-form">
  <div class="form-columns">
    <div class="column">
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" id="name" name="name" required="">
      </div>
      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" id="username" name="username" required="">
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required="">
      </div>
      <div class="form-group">
        <label for="website">Website</label>
        <input type="text" id="website" name="website" required="">
      </div>
      <div class="form-group">
        <label for="phone">Phone</label>
        <input type="text" id="phone" name="phone" required="">
      </div>
    </div>
    <div class="column">
      <div class="form-group">
        <label for="street">Street</label>
        <input type="text" id="street" name="street" required="">
      </div>
      <div class="form-group">
        <label for="city">City</label>
        <input type="text" id="city" name="city" required="">
      </div>
      <div class="form-group">
        <label for="zipcode">Zipcode</label>
        <input type="text" id="zipcode" name="zipcode" required="">
      </div>
      <div class="form-group">
        <label for="companyName">Company Name</label>
        <input type="text" id="companyName" name="companyName" required="">
      </div>
      <div class="form-group">
        <label for="catchPhrase">Catch Phrase</label>
        <input type="text" id="catchPhrase" name="catchPhrase" required="">
      </div>
    </div>
  </div>
  <div class="form-group button-group">
    <button type="submit">Add User</button>
  </div>
</form>
</div>
`;
