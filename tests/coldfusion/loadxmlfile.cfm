<cfsetting showdebugoutput="false"><cfcontent type="text/xml"><?xml version="1.0" ?>
<mx:Application xmlns:mx="http://www.macromedia.com/2003/mxml" width="400" height="300">
	<mx:CurrencyFormatter id="PriceFormatter" precision="2" decimalSeparatorTo="."
		currencySymbol="$" alignSymbol="left"
	/>

	<mx:DataGrid editable="true" widthFlex="1" heightFlex="1">
		<mx:dataProvider>
			<mx:Array>
				<mx:Object>
					<Artist>Stevie Wonder</Artist>
					<Price>10.995</Price>
					<Album>The Definitive Collection</Album>
					<Amount>2</Amount>
				</mx:Object>

				<mx:Object>
					<Artist>Stevie Wonder</Artist>
					<Album>Songs in the Key of Life</Album>
					<Price>26.99</Price>
					<Amount>4</Amount>
				</mx:Object>

				<mx:Object>
					<Artist>Stevie Wonder</Artist>
					<Album>Innervisions</Album>
					<Price>13.99</Price>
					<Amount>1</Amount>
				</mx:Object>
			</mx:Array>
		</mx:dataProvider>

		<mx:columns>
			<mx:Array>
				<mx:DataGridColumn columnName="Album" editable="false" width="150" />
				<mx:DataGridColumn columnName="Price" editable="false" labelFunction="formatPrice" width="60" />
				<mx:DataGridColumn columnName="Amount" width="60" />
				<mx:DataGridColumn headerText="Sum" editable="false" labelFunction="calculateTotal" width="60" />
			</mx:Array>
		</mx:columns>

	</mx:DataGrid>
</mx:Application>