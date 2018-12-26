<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
</head>
<body>
	<div class="container">
		<div class="row">
			<div class="col-6 offset-3">
				<form action="" class="mt-3">
					<div class="form-group ">
						<label for="">Input number of group (from 1 to 10)</label>
						<input type="number" id="data-id" class="form-control">
					</div>
					<div class="form-group">
						<input type="button" id="btn-load" class="btn btn-primary" value="Load data">
						<div class="data-container"></div>
					</div>
				</form>
			</div>
		</div>
	</div>
	<script src="load.js"></script>
</body>
</html>