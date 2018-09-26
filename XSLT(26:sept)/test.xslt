<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:bpi="urn:gs1:tsd:basic_product_information_module:xsd:1" xmlns:pai="urn:gs1:tsd:product_allergen_information_module:xsd:1"  exclude-result-prefixes="bpi pai">
<xsl:output  method="xml"  indent="yes"/>
 <xsl:template match="productData">
<productData>

<gtin><xsl:value-of select="gtin"/></gtin>
<targetMarket><xsl:value-of select="targetMarket"/></targetMarket>
<informationProviderGLN><xsl:value-of select="informationProviderGLN"/></informationProviderGLN>
<informationProviderName><xsl:value-of select="informationProviderName"/></informationProviderName>
 <basicProductInformation>
<productName ><xsl:attribute name="languageCode"><xsl:value-of select="productDataRecord/module/bpi:basicProductInformationModule/productName/@languageCode"/></xsl:attribute><xsl:value-of select="productDataRecord/module/bpi:basicProductInformationModule/productName"/></productName>
<gpcCategoryCode><xsl:value-of select="productDataRecord/module/bpi:basicProductInformationModule/gpcCategoryCode"/></gpcCategoryCode>
<regulatedProductName><xsl:attribute name="languageCode"><xsl:value-of select="productDataRecord/module/bpi:basicProductInformationModule/regulatedProductName/@languageCode"/></xsl:attribute>
<xsl:value-of select="productDataRecord/module/bpi:basicProductInformationModule/regulatedProductName"/></regulatedProductName>
<brandName><xsl:value-of select="productDataRecord/module/bpi:basicProductInformationModule/brandNameInformation/brandName"/></brandName>
</basicProductInformation>

<productAllergenInformation>
 <allergen>
 <xsl:for-each select="productDataRecord/module/pai:productAllergenInformationModule/allergenRelatedInformation/allergen">
   <allergenCode>   <xsl:value-of select="allergenTypeCode"/></allergenCode>
    </xsl:for-each>
 </allergen>


</productAllergenInformation>

 </productData>
</xsl:template>
</xsl:stylesheet>
